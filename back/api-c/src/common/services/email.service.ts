import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import axios from 'axios';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const url = `http://localhost:4200/verify-email?token=${token}`;
    const subject = 'Verifica tu dirección de correo electrónico';
    const html = `
      <h1>¡Bienvenido!</h1>
      <p>Por favor, verifica tu dirección de correo electrónico haciendo clic en el siguiente enlace:</p>
      <p><a href="${url}">${url}</a></p>
    `;
    const text = `¡Bienvenido! Por favor, verifica tu dirección de correo electrónico haciendo clic en el siguiente enlace: ${url}`;

    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    
    // 1. Resend API
    if (resendApiKey) {
      this.logger.log(`Enviando correo vía Resend API a ${email}`);
      try {
        await axios.post(
          'https://api.resend.com/emails',
          {
            from: this.configService.get<string>('SMTP_FROM') || 'onboarding@resend.dev',
            to: email,
            subject,
            html,
            text,
          },
          {
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
          },
        );
        this.logger.log(`Correo enviado exitosamente vía Resend API`);
        return;
      } catch (error: any) {
        this.logger.error(`Error al enviar correo vía Resend API: ${error.message}`, error.response?.data);
        throw error;
      }
    }

    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<string>('SMTP_PORT');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    const smtpFrom = this.configService.get<string>('SMTP_FROM');

    // 2. SMTP
    if (smtpHost && smtpPort && smtpUser && smtpPass && smtpFrom) {
      this.logger.log(`Enviando correo vía SMTP a ${email}`);
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(smtpPort),
          secure: Number(smtpPort) === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: smtpFrom,
          to: email,
          subject,
          text,
          html,
        });

        this.logger.log(`Correo enviado exitosamente vía SMTP`);
        return;
      } catch (error: any) {
        this.logger.error(`Error al enviar correo vía SMTP: ${error.message}`);
        throw error;
      }
    }

    // 3. Fallback Log
    this.logger.log(`[DESARROLLO LOCAL] No se detectaron credenciales de correo (Resend ni SMTP).`);
    this.logger.log(`Para: ${email}`);
    this.logger.log(`Asunto: ${subject}`);
    this.logger.log(`Enlace de verificación: ${url}`);
    this.logger.log(`Contenido del correo:\n${text}`);
  }

  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    const url = `http://localhost:4200/reset-password?token=${token}`;
    const subject = 'Restablece tu contraseña';
    const html = `
      <h1>Restablecer contraseña</h1>
      <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
      <p><a href="${url}">${url}</a></p>
      <p>Este enlace expirará en 1 hora.</p>
    `;
    const text = `Restablece tu contraseña haciendo clic en el siguiente enlace: ${url} (Expira en 1 hora)`;

    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    
    if (resendApiKey) {
      this.logger.log(`Enviando correo de recuperación vía Resend API a ${email}`);
      try {
        await axios.post(
          'https://api.resend.com/emails',
          {
            from: this.configService.get<string>('SMTP_FROM') || 'onboarding@resend.dev',
            to: email,
            subject,
            html,
            text,
          },
          {
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
          },
        );
        this.logger.log(`Correo de recuperación enviado exitosamente vía Resend API`);
        return;
      } catch (error: any) {
        this.logger.error(`Error al enviar correo de recuperación vía Resend API: ${error.message}`, error.response?.data);
        throw error;
      }
    }

    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<string>('SMTP_PORT');
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPass = this.configService.get<string>('SMTP_PASS');
    const smtpFrom = this.configService.get<string>('SMTP_FROM');

    if (smtpHost && smtpPort && smtpUser && smtpPass && smtpFrom) {
      this.logger.log(`Enviando correo de recuperación vía SMTP a ${email}`);
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: Number(smtpPort),
          secure: Number(smtpPort) === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: smtpFrom,
          to: email,
          subject,
          text,
          html,
        });

        this.logger.log(`Correo de recuperación enviado exitosamente vía SMTP`);
        return;
      } catch (error: any) {
        this.logger.error(`Error al enviar correo de recuperación vía SMTP: ${error.message}`);
        throw error;
      }
    }

    this.logger.log(`[DESARROLLO LOCAL] No se detectaron credenciales de correo (Resend ni SMTP) para restablecer clave.`);
    this.logger.log(`Para: ${email}`);
    this.logger.log(`Asunto: ${subject}`);
    this.logger.log(`Enlace de restablecimiento: ${url}`);
    this.logger.log(`Contenido del correo:\n${text}`);
  }
}
