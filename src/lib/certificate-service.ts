import prisma from '@/lib/prisma';
import { DEFAULT_CERTIFICATE_TEMPLATE, CertificateTemplateConfig } from './certificate-types';
import { createAuditLog } from './auth';
import { NextRequest } from 'next/server';

export const CERTIFICATE_CONTENT_KEY = 'certificate.template';

export async function getCertificateTemplate(): Promise<CertificateTemplateConfig> {
  try {
    const record = await prisma.siteContent.findUnique({
      where: { key: CERTIFICATE_CONTENT_KEY },
    });

    if (record?.value) {
      const parsed = JSON.parse(record.value);
      if (parsed && typeof parsed === 'object') {
        return {
          ...DEFAULT_CERTIFICATE_TEMPLATE,
          ...parsed,
          elements: Array.isArray(parsed.elements) ? parsed.elements : DEFAULT_CERTIFICATE_TEMPLATE.elements,
        };
      }
    }
  } catch (err) {
    console.error('Failed to load certificate template from database:', err);
  }

  return DEFAULT_CERTIFICATE_TEMPLATE;
}

export async function saveCertificateTemplate(
  template: Partial<CertificateTemplateConfig>,
  userId?: string,
  req?: NextRequest
): Promise<CertificateTemplateConfig> {
  const current = await getCertificateTemplate();
  const merged: CertificateTemplateConfig = {
    ...current,
    ...template,
    width: template.width || current.width,
    height: template.height || current.height,
    aspectRatio: template.aspectRatio || current.aspectRatio,
    baseDesignUrl: template.baseDesignUrl !== undefined ? template.baseDesignUrl : current.baseDesignUrl,
    backgroundColor: template.backgroundColor || current.backgroundColor,
    elements: Array.isArray(template.elements) ? template.elements : current.elements,
  };

  await prisma.siteContent.upsert({
    where: { key: CERTIFICATE_CONTENT_KEY },
    update: {
      contentType: 'json',
      value: JSON.stringify(merged),
      updatedBy: userId,
    },
    create: {
      key: CERTIFICATE_CONTENT_KEY,
      contentType: 'json',
      value: JSON.stringify(merged),
      page: 'certificate',
      section: 'template',
      updatedBy: userId,
    },
  });

  if (userId) {
    await createAuditLog({
      userId,
      action: 'CERTIFICATE_TEMPLATE_SAVED',
      entityType: 'SiteContent',
      entityId: CERTIFICATE_CONTENT_KEY,
      newValue: merged,
      req,
    });
  }

  return merged;
}

export async function resetCertificateTemplate(
  userId?: string,
  req?: NextRequest
): Promise<CertificateTemplateConfig> {
  await prisma.siteContent.upsert({
    where: { key: CERTIFICATE_CONTENT_KEY },
    update: {
      contentType: 'json',
      value: JSON.stringify(DEFAULT_CERTIFICATE_TEMPLATE),
      updatedBy: userId,
    },
    create: {
      key: CERTIFICATE_CONTENT_KEY,
      contentType: 'json',
      value: JSON.stringify(DEFAULT_CERTIFICATE_TEMPLATE),
      page: 'certificate',
      section: 'template',
      updatedBy: userId,
    },
  });

  if (userId) {
    await createAuditLog({
      userId,
      action: 'CERTIFICATE_TEMPLATE_RESET',
      entityType: 'SiteContent',
      entityId: CERTIFICATE_CONTENT_KEY,
      newValue: DEFAULT_CERTIFICATE_TEMPLATE,
      req,
    });
  }

  return DEFAULT_CERTIFICATE_TEMPLATE;
}
