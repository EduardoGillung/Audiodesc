// Utilitários de validação e segurança

export class SecurityValidator {
  // Lista de domínios permitidos para URLs externas
  private static readonly ALLOWED_DOMAINS = [
    'cdn.openai.com',
    'api.openai.com',
    'storage.googleapis.com',
    'amazonaws.com',
    's3.amazonaws.com',
    // Adicione outros domínios confiáveis conforme necessário
  ];

  // Lista de IPs privados/locais bloqueados
  private static readonly BLOCKED_IPS = [
    /^127\./,           // localhost
    /^10\./,            // Private network
    /^172\.(1[6-9]|2[0-9]|3[01])\./,  // Private network
    /^192\.168\./,      // Private network
    /^169\.254\./,      // Link-local
    /^::1$/,            // IPv6 localhost
    /^fc00:/,           // IPv6 private
    /^fe80:/,           // IPv6 link-local
  ];

  /**
   * Valida se uma URL é segura para fetch externo
   */
  static validateExternalUrl(url: string): { isValid: boolean; error?: string } {
    try {
      const urlObj = new URL(url);
      
      // Verificar protocolo
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return { isValid: false, error: 'Protocolo não permitido' };
      }

      // Verificar se é HTTPS em produção
      if (process.env.NODE_ENV === 'production' && urlObj.protocol !== 'https:') {
        return { isValid: false, error: 'HTTPS obrigatório em produção' };
      }

      // Verificar domínio
      const hostname = urlObj.hostname.toLowerCase();
      
      // Bloquear IPs privados
      for (const blockedPattern of this.BLOCKED_IPS) {
        if (blockedPattern.test(hostname)) {
          return { isValid: false, error: 'IP privado/local não permitido' };
        }
      }

      // Verificar se o domínio está na lista permitida (opcional - remova se quiser permitir todos)
      // const isAllowedDomain = this.ALLOWED_DOMAINS.some(domain => 
      //   hostname === domain || hostname.endsWith('.' + domain)
      // );
      // if (!isAllowedDomain) {
      //   return { isValid: false, error: 'Domínio não permitido' };
      // }

      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: 'URL inválida' };
    }
  }

  /**
   * Valida tipo de arquivo de áudio
   */
  static validateAudioFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/m4a',
      'audio/webm',
      'audio/ogg',
      'audio/opus',
      'audio/mp4',
      'audio/x-m4a',
    ];

    const allowedExtensions = /\.(mp3|wav|m4a|webm|ogg|opus|mp4)$/i;

    // Verificar tipo MIME
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Tipo de arquivo não permitido' };
    }

    // Verificar extensão
    if (!allowedExtensions.test(file.name)) {
      return { isValid: false, error: 'Extensão de arquivo não permitida' };
    }

    // Verificar tamanho (máximo 25MB)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      return { isValid: false, error: 'Arquivo muito grande (máximo 25MB)' };
    }

    return { isValid: true };
  }

  /**
   * Sanitiza texto de entrada
   */
  static sanitizeText(text: string): string {
    return text
      .replace(/[<>]/g, '') // Remove < e >
      .replace(/javascript:/gi, '') // Remove javascript:
      .replace(/data:/gi, '') // Remove data:
      .trim()
      .substring(0, 10000); // Limita tamanho
  }

  /**
   * Valida entrada de texto
   */
  static validateTextInput(text: string): { isValid: boolean; error?: string } {
    if (!text || typeof text !== 'string') {
      return { isValid: false, error: 'Texto é obrigatório' };
    }

    if (text.length > 10000) {
      return { isValid: false, error: 'Texto muito longo (máximo 10.000 caracteres)' };
    }

    // Verificar padrões suspeitos
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:text\/html/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(text)) {
        return { isValid: false, error: 'Conteúdo suspeito detectado' };
      }
    }

    return { isValid: true };
  }
}

// Rate limiting simples em memória (para produção, use Redis)
class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>();

  static checkLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier);

    if (!userRequests || now > userRequests.resetTime) {
      this.requests.set(identifier, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (userRequests.count >= maxRequests) {
      return false;
    }

    userRequests.count++;
    return true;
  }

  static cleanup() {
    const now = Date.now();
    for (const [key, value] of this.requests.entries()) {
      if (now > value.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Limpar rate limiter a cada 5 minutos
setInterval(() => RateLimiter.cleanup(), 5 * 60 * 1000);

export { RateLimiter };