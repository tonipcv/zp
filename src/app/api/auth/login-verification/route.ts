import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import nodemailer from 'nodemailer';
import { compare } from 'bcryptjs';

// Create a transporter using SMTP configuration from .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !email.includes('@') || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify password
    const isCorrectPassword = await compare(password, user.password);

    if (!isCorrectPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Generate a 6-digit verification code
    const verificationCode = randomBytes(3).toString('hex').substring(0, 6).toUpperCase();
    
    // Store the verification code in the database with expiration
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Code expires in 15 minutes
    
    // Check if a login verification code already exists for this email
    const existingCode = await prisma.verificationCode.findFirst({
      where: { email },
    });

    if (existingCode) {
      // Update existing code
      await prisma.verificationCode.update({
        where: { id: existingCode.id },
        data: {
          code: verificationCode,
          expiresAt,
          verified: false, // Reset verification status
        },
      });
    } else {
      // Create new code
      await prisma.verificationCode.create({
        data: {
          email,
          code: verificationCode,
          expiresAt,
        },
      });
    }

    // Send email with verification code
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: email,
      subject: 'XASE - Login Verification Code',
      text: `Your login verification code is: ${verificationCode}. It will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Your Login Verification Code</h2>
          <p>Please use the following code to verify your login:</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
            ${verificationCode}
          </div>
          <p>This code will expire in 15 minutes.</p>
          <p>If you didn't request this code, please secure your account immediately.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending login verification code:', error);
    return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 });
  }
}
