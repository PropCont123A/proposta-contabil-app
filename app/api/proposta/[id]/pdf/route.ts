// Caminho: app/proposta/[id]/pdf/route.ts
// VERSÃO CORRIGIDA POR MANUS

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/server';
import { PDFDocument, rgb, PDFFont, PDFHexString, PageSizes, degrees } from 'pdf-lib';
import * as fontkit from 'fontkit';
import fs from 'fs/promises';
import path from 'path';

// --- TIPAGENS ---
type ServicoProposta = {
    nome: string;
    valor: number;
    itens: string[] | null;
    categoria: 'Recorrente' | 'Eventual' | null;
};
type PropostaData = {
  escritorio: {
    razao_social: string;
    logo_url: string | null;
    sobre_nos_texto: string | null;
    endereco: string | null;
    telefone: string | null;
    site: string | null;
    instagram: string | null;
    facebook: string | null;
    whatsapp: string | null;
    linkedin: string | null;
    crc_escritorio: string | null;
  } | null;
  clientes: { id: number; nome_fantasia_ou_nome: string | null; contato_nome: string | null; telefone: string | null; } | null;
  nome_cliente_avulso: string | null;
  data_proposta: string;
  validade_dias: number;
  observacoes: string | null;
  valor_total: number | null;
  servicos_proposta: ServicoProposta[] | null;
};
type Fonts = { regular: PDFFont; bold: PDFFont; primaryColor: ReturnType<typeof rgb>; accentColor: ReturnType<typeof rgb>; textColor: ReturnType<typeof rgb>; }
type IconImages = {
    instagram: any | null;
    facebook: any | null;
    whatsapp: any | null;
    linkedin: any | null;
    site: any | null;
}

// --- FUNÇÕES DE DESENHO ---
async function drawPageTemplate(page: any) {
    const { width, height } = page.getSize();
    const accentColor = rgb(122 / 255, 193 / 255, 67 / 255);
    const primaryColor = rgb(37 / 255, 48 / 255, 79 / 255);
    const opacity = 0.2;
    const drawDiamond = (x: number, y: number, size: number, color: ReturnType<typeof rgb>) => { page.drawRectangle({ x: x - size / 2, y: y - size / 2, width: size, height: size, rotate: degrees(45), color: color, opacity: opacity }); };
    const diamondSize = 150;
    const positions = [ { x: width * 0.75, y: height * 0.95, size: diamondSize * 0.6, color: primaryColor }, { x: width * 0.85, y: height * 0.8, size: diamondSize, color: accentColor }, { x: width * 0.7, y: height * 0.65, size: diamondSize * 0.9, color: primaryColor }, { x: width * 0.9, y: height * 0.5, size: diamondSize * 0.7, color: accentColor }, { x: width * 0.75, y: height * 0.35, size: diamondSize, color: primaryColor }, { x: width * 0.85, y: height * 0.2, size: diamondSize * 0.8, color: accentColor }, { x: width * 0.7, y: height * 0.05, size: diamondSize * 0.9, color: primaryColor }, ];
    for (const pos of positions) { drawDiamond(pos.x, pos.y, pos.size, pos.color); }
}
async function drawInternalPageLogo(page: any, logo: any) {
    const { width, height } = page.getSize();
    const margin = 50;
    if (logo) {
        const logoDims = logo.scaleToFit(120, 50);
        page.drawImage(logo, { x: width - margin - logoDims.width, y: height - margin - logoDims.height, width: logoDims.width, height: logoDims.height });
    }
}
async function drawFooter(page: any, data: PropostaData, fonts: Fonts, icons: IconImages) {
    const { width } = page.getSize();
    const footerTextColor = rgb(0.4, 0.4, 0.4);
    const razaoSocialColor = rgb(0.2, 0.2, 0.2);
    const boxWidth = width - 100;
    const boxX = 50;
    const boxY = 40;
    const borderRadius = 12;
    const boxHeight = 130;
    page.drawRectangle({ x: boxX, y: boxY, width: boxWidth, height: boxHeight, borderColor: footerTextColor, borderWidth: 0.1, borderRadius: borderRadius, });
    const topPadding = 18;
    let textY = boxY + boxHeight - topPadding;
    const razaoText = data.escritorio?.razao_social || '';
    const razaoWidth = fonts.bold.widthOfTextAtSize(razaoText, 9);
    page.drawText(razaoText, { x: (width - razaoWidth) / 2, y: textY, font: fonts.bold, size: 9, color: razaoSocialColor });
    textY -= 8;
    const enderecoText = data.escritorio?.endereco || '';
    const enderecoWidth = fonts.regular.widthOfTextAtSize(enderecoText, 8);
    const dividerWidth = enderecoWidth;
    page.drawLine({ start: { x: (width - dividerWidth) / 2, y: textY }, end: { x: (width + dividerWidth) / 2, y: textY }, thickness: 0.1, color: footerTextColor, });
    textY -= 16;
    page.drawText(enderecoText, { x: (width - enderecoWidth) / 2, y: textY, font: fonts.regular, size: 8, color: footerTextColor });
    textY -= 12;
    const contatoText = `Contato: ${data.escritorio?.telefone || ''}`;
    const siteText = data.escritorio?.site ? ` | Site: ${data.escritorio.site}` : '';
    const fullTextLine3 = contatoText + siteText;
    const textWidth3 = fonts.regular.widthOfTextAtSize(fullTextLine3, 8);
    page.drawText(fullTextLine3, { x: (width - textWidth3) / 2, y: textY, font: fonts.regular, size: 8, color: footerTextColor });
    textY -= 12;
    if (data.escritorio?.crc_escritorio) {
        const crcText = `Contabilidade Habilitada pelo CRC Nº: ${data.escritorio.crc_escritorio}`;
        const crcWidth = fonts.regular.widthOfTextAtSize(crcText, 8);
        page.drawText(crcText, { x: (width - crcWidth) / 2, y: textY, font: fonts.regular, size: 8, color: footerTextColor });
        textY -= 12;
    }
    textY -= 8;
    const ctaText = 'Clique e conheça nossas redes';
    const ctaWidth = fonts.regular.widthOfTextAtSize(ctaText, 7);
    page.drawText(ctaText, { x: (width - ctaWidth) / 2, y: textY, font: fonts.regular, size: 7, color: footerTextColor, underline: true, });
    const bottomPadding = 18;
    const iconSize = 15;
    const iconSpacing = 20;
    const iconsY = boxY + bottomPadding;
    const iconsToDraw = [];
    const sanitizeUrl = (url: string, type: 'whatsapp' | 'generic' = 'generic') => {
        if (!url) return null;
        if (type === 'whatsapp') {
            const digits = url.replace(/\D/g, '');
            return `https://wa.me/${digits.startsWith('55'    ) ? digits : '55' + digits}`;
        }
        if (url.startsWith('http://'    ) || url.startsWith('https://'    )) {
            return url;
        }
        return `https://${url}`;
    };
    if (data.escritorio?.instagram && icons.instagram    ) iconsToDraw.push({ image: icons.instagram, url: sanitizeUrl(data.escritorio.instagram) });
    if (data.escritorio?.facebook && icons.facebook) iconsToDraw.push({ image: icons.facebook, url: sanitizeUrl(data.escritorio.facebook) });
    if (data.escritorio?.whatsapp && icons.whatsapp) iconsToDraw.push({ image: icons.whatsapp, url: sanitizeUrl(data.escritorio.whatsapp, 'whatsapp') });
    if (data.escritorio?.linkedin && icons.linkedin) iconsToDraw.push({ image: icons.linkedin, url: sanitizeUrl(data.escritorio.linkedin) });
    if (data.escritorio?.site && icons.site) iconsToDraw.push({ image: icons.site, url: sanitizeUrl(data.escritorio.site) });
    const totalIconsWidth = (iconsToDraw.length * iconSize) + (Math.max(0, iconsToDraw.length - 1) * iconSpacing);
    let currentIconX = (width - totalIconsWidth) / 2;
    for (const icon of iconsToDraw) {
        if (!icon.url) continue;
        page.drawImage(icon.image, { x: currentIconX, y: iconsY, width: iconSize, height: iconSize });
        page.node.Annots().push(page.doc.context.obj({ Type: 'Annot', Subtype: 'Link', Rect: [currentIconX, iconsY, currentIconX + iconSize, iconsY + iconSize], Border: [0, 0, 0], A: { Type: 'Action', S: 'URI', URI: PDFHexString.fromText(icon.url) } }));
        currentIconX += iconSize + iconSpacing;
    }
}
async function drawAboutUsPage(pdfDoc: PDFDocument, data: PropostaData, fonts: Fonts, logo: any, icons: IconImages) {
    if (!data.escritorio?.sobre_nos_texto) return;
    let page = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = page.getSize();
    const margin = 50;
    await drawPageTemplate(page);
    await drawInternalPageLogo(page, logo);
    let y = height - margin - 60;
    const contentWidth = width - (margin * 2);
    page.drawText('Sobre Nós', { x: margin, y: y, font: fonts.bold, size: 24, color: fonts.primaryColor });
    y -= 30;
    page.drawLine({ start: { x: margin, y: y }, end: { x: margin + contentWidth, y: y }, thickness: 1, color: fonts.accentColor });
    y -= 25;
    const text = data.escritorio.sobre_nos_texto;
    const paragraphs = text.split('\n').filter(p => p.trim() !== '');
    const fontSize = 11;
    const lineHeight = 18;
    const spaceWidth = fonts.regular.widthOfTextAtSize(' ', fontSize);
    for (const paragraph of paragraphs) {
        if (y < 150) {
            page = pdfDoc.addPage(PageSizes.A4);
            await drawPageTemplate(page);
            await drawInternalPageLogo(page, logo);
            y = height - margin - 60;
        }
        const words = paragraph.trim().split(' ');
        let line = '';
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const testLine = line + (line ? ' ' : '') + word;
            const testWidth = fonts.regular.widthOfTextAtSize(testLine, fontSize);
            if (testWidth > contentWidth) {
                const lineWords = line.split(' ');
                const lineWidth = fonts.regular.widthOfTextAtSize(line, fontSize);
                const extraSpace = contentWidth - lineWidth;
                const spaceCount = lineWords.length - 1;
                let currentX = margin;
                if (spaceCount > 0) {
                    const spaceToAdd = extraSpace / spaceCount;
                    for (const w of lineWords) {
                        page.drawText(w, { x: currentX, y: y, font: fonts.regular, size: fontSize, color: fonts.textColor });
                        currentX += fonts.regular.widthOfTextAtSize(w, fontSize) + spaceWidth + spaceToAdd;
                    }
                } else {
                    page.drawText(line, { x: margin, y: y, font: fonts.regular, size: fontSize, color: fonts.textColor });
                }
                y -= lineHeight;
                line = word;
            } else {
                line = testLine;
            }
        }
        page.drawText(line, { x: margin, y: y, font: fonts.regular, size: fontSize, color: fonts.textColor });
        y -= lineHeight;
        y -= 10;
    }
    await drawFooter(page, data, fonts, icons);
}
async function drawCoverPage(pdfDoc: PDFDocument, data: PropostaData, fonts: Fonts, logo: any) {
    const page = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = page.getSize();
    const margin = 50;
    await drawPageTemplate(page);
    if (logo) {
        const logoDims = logo.scaleToFit(180, 80);
        page.drawImage(logo, { x: margin, y: height - margin - logoDims.height, width: logoDims.width, height: logoDims.height });
    }
    const titleY = height / 2;
    page.drawText('PROPOSTA DE', { x: margin, y: titleY, font: fonts.bold, size: 42, color: fonts.primaryColor });
    page.drawText('CONTABILIDADE', { x: margin, y: titleY - 50, font: fonts.bold, size: 42, color: fonts.primaryColor });
    let infoY = titleY - 150;
    const lineHeight = 16;
    page.drawText('Cliente', { x: margin, y: infoY, font: fonts.bold, size: 12, color: fonts.primaryColor });
    infoY -= lineHeight;
    const contatos = data.clientes?.contato_nome?.split('/').map(name => name.trim()).filter(Boolean) || [];
    if (contatos.length > 0) {
        for (const contato of contatos) { page.drawText(contato, { x: margin, y: infoY, font: fonts.regular, size: 11, color: fonts.textColor }); infoY -= lineHeight; }
    } else { page.drawText('Não informado', { x: margin, y: infoY, font: fonts.regular, size: 11, color: fonts.textColor }); infoY -= lineHeight; }
    infoY -= lineHeight;
    page.drawText('Empresa', { x: margin, y: infoY, font: fonts.bold, size: 12, color: fonts.primaryColor });
    infoY -= lineHeight;
    const empresas = data.clientes?.nome_fantasia_ou_nome?.split('/').map(name => name.trim()).filter(Boolean) || [];
    if (empresas.length > 0) {
        for (const empresa of empresas) { page.drawText(empresa, { x: margin, y: infoY, font: fonts.regular, size: 11, color: fonts.textColor }); infoY -= lineHeight; }
    } else { page.drawText('Não informada', { x: margin, y: infoY, font: fonts.regular, size: 11, color: fonts.textColor }); infoY -= lineHeight; }
    infoY -= lineHeight;
    const date = new Date(data.data_proposta + 'T00:00:00');
    const validThru = new Date(date);
    validThru.setDate(date.getDate() + (data.validade_dias || 10));
    const dateText = `Data da Proposta: ${date.toLocaleDateString('pt-BR')}`;
    page.drawText(dateText, { x: margin, y: infoY, font: fonts.regular, size: 10, color: rgb(0.4, 0.4, 0.4) });
    const validityText = `Válida até: ${validThru.toLocaleDateString('pt-BR')}`;
    page.drawText(validityText, { x: margin, y: infoY - 15, font: fonts.regular, size: 10, color: rgb(0.4, 0.4, 0.4) });
}
async function drawServicesPage(pdfDoc: PDFDocument, data: PropostaData, fonts: Fonts, logo: any, icons: IconImages) {
    if (!data.servicos_proposta || data.servicos_proposta.length === 0) return;
    let page = pdfDoc.addPage(PageSizes.A4);
    const { width, height } = page.getSize();
    const margin = 50;
    await drawPageTemplate(page);
    await drawInternalPageLogo(page, logo);
    let y = height - margin - 60;
    const contentWidth = width - (margin * 2);
    page.drawText('Serviços da Proposta', { x: margin, y: y, font: fonts.bold, size: 24, color: fonts.primaryColor });
    y -= 30;
    page.drawLine({ start: { x: margin, y: y }, end: { x: margin + contentWidth, y: y }, thickness: 1, color: fonts.accentColor });
    y -= 40;
    for (const servico of data.servicos_proposta) {
        let blockHeight = 60;
        if (servico.itens) {
            blockHeight += servico.itens.length * 18;
        }
        if (y < blockHeight) {
            page = pdfDoc.addPage(PageSizes.A4);
            await drawPageTemplate(page);
            await drawInternalPageLogo(page, logo);
            y = height - margin - 60;
        }
        const boxStartY = y;
        let contentY = y - 20;
        const tagText = servico.categoria === 'Recorrente' ? 'SERVIÇO DE RECORRÊNCIA MENSAL' : 'SERVIÇO EVENTUAL';
        const tagColor = servico.categoria === 'Recorrente' ? fonts.primaryColor : fonts.accentColor;
        const tagWidth = fonts.bold.widthOfTextAtSize(tagText, 8) + 20;
        page.drawRectangle({ x: margin, y: contentY - 2, width: tagWidth, height: 18, color: tagColor, borderRadius: 9, });
        page.drawText(tagText, { x: margin + 10, y: contentY + 4, font: fonts.bold, size: 8, color: rgb(1, 1, 1), });
        contentY -= 35;
        page.drawText(servico.nome, { x: margin + 15, y: contentY, font: fonts.bold, size: 14, color: fonts.primaryColor });
        contentY -= 25;
        if (servico.itens) {
            for (const item of servico.itens) {
                page.drawText('•', { x: margin + 15, y: contentY, font: fonts.regular, size: 10, color: fonts.accentColor });
                page.drawText(item, { x: margin + 30, y: contentY, font: fonts.regular, size: 10, color: fonts.textColor, maxWidth: contentWidth - 45 });
                contentY -= 18;
            }
        }
        contentY -= 10;
        const valorString = `Valor: R$ ${servico.valor.toFixed(2).replace('.', ',')}`;
        page.drawText(valorString, { x: margin + 15, y: contentY, font: fonts.bold, size: 11, color: fonts.accentColor });
        contentY -= 20;
        const boxHeight = boxStartY - contentY;
        page.drawRectangle({ x: margin, y: contentY, width: contentWidth, height: boxHeight, borderColor: rgb(0.85, 0.85, 0.85), borderWidth: 0.5, borderRadius: 8, });
        y = contentY - 20;
    }
}

// --- FUNÇÃO GET (Com a tipagem CORRIGIDA) ---
export async function GET(
    request: Request, // O primeiro argumento é sempre o request
    { params }: { params: { id: string } } // O segundo argumento é desestruturado para pegar os 'params'
) {
  const { id } = params; // 'id' vem de 'params'
  if (!id) { return new NextResponse('ID da proposta não fornecido', { status: 400 }); }

  const supabase = createServerClient();
  
  const { data, error: rpcError } = await supabase.rpc('get_proposal_details_for_pdf', { p_share_id: id }).single();

  if (rpcError || !data) {
    console.error('Erro ao buscar dados para o PDF:', rpcError);
    return new NextResponse('Proposta não encontrada ou erro nos dados', { status: 404 });
  }
  const propostaData = data as PropostaData;

  try {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const fontPathRegular = path.resolve(process.cwd(), 'public/fonts/Poppins-Regular.ttf');
    const fontPathBold = path.resolve(process.cwd(), 'public/fonts/Poppins-Bold.ttf');
    const fontBytesRegular = await fs.readFile(fontPathRegular);
    const fontBytesBold = await fs.readFile(fontPathBold);

    const fonts: Fonts = {
        regular: await pdfDoc.embedFont(fontBytesRegular),
        bold: await pdfDoc.embedFont(fontBytesBold),
        primaryColor: rgb(37 / 255, 48 / 255, 79 / 255),
        accentColor: rgb(122 / 255, 193 / 255, 67 / 255),
        textColor: rgb(0.2, 0.2, 0.2),
    };

    let logoImage = null;
    if (propostaData.escritorio?.logo_url) {
        try {
            const logoImageBytes = await fetch(propostaData.escritorio.logo_url).then(res => res.arrayBuffer());
            logoImage = await pdfDoc.embedPng(logoImageBytes);
        } catch (e) { console.error("Não foi possível carregar a logo:", e); }
    }

    const icons: IconImages = { instagram: null, facebook: null, whatsapp: null, linkedin: null, site: null };
    const loadIcon = async (name: keyof IconImages) => {
        try {
            const bytes = await fs.readFile(path.resolve(process.cwd(), `public/icons/${name}.png`));
            icons[name] = await pdfDoc.embedPng(bytes);
        } catch (e) { console.warn(`Ícone '${name}.png' não encontrado. Pulando.`); }
    };
    await Promise.all([
        loadIcon('instagram'),
        loadIcon('facebook'),
        loadIcon('whatsapp'),
        loadIcon('linkedin'),
        loadIcon('site'),
    ]);

    await drawCoverPage(pdfDoc, propostaData, fonts, logoImage);
    await drawAboutUsPage(pdfDoc, propostaData, fonts, logoImage, icons);
    await drawServicesPage(pdfDoc, propostaData, fonts, logoImage, icons);

    const pdfBytes = await pdfDoc.save();
    return new NextResponse(pdfBytes, {
      status: 200,
      headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `inline; filename="proposta_${id}.pdf"` },
    });

  } catch (error) {
    console.error('ERRO FATAL AO GERAR PDF:', error);
    return new NextResponse('Erro interno ao gerar o PDF', { status: 500 });
  }
}
