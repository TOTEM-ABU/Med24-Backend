import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

@Injectable()
export class ScraperService {
  private readonly baseUrl = 'https://med24.uz';

  private async fetchFirstAvailableHtml(paths: string[]) {
    for (const path of paths) {
      try {
        const html = await this.renderWithPuppeteer(this.baseUrl + path);
        if (html && typeof html === 'string') {
          const $ = cheerio.load(html);
          return $;
        }
      } catch (_) {
        // try next path
      }
    }
    throw new Error('Failed to fetch HTML from all candidate paths');
  }

  private async renderWithPuppeteer(url: string): Promise<string> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    try {
      const page = await browser.newPage();
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      );
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        if (['image', 'font', 'media'].includes(req.resourceType())) {
          req.abort();
        } else {
          req.continue();
        }
      });
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      const content = await page.content();
      return content;
    } finally {
      await browser.close();
    }
  }

  async scrapeClinics(city?: string) {
    const $ = await this.fetchFirstAvailableHtml(['/', '/ru']);

    const clinics: any[] = [];
    // Try to locate homepage clinics section by heading text
    const clinicsSection = $('h2, h3')
      .filter(
        (_, el) =>
          $(el).text().toLowerCase().includes('клиники') &&
          $(el).text().toLowerCase().includes('ташкент'),
      )
      .first()
      .closest('section, div');

    const cards = clinicsSection.find('a, div').filter((_, el) => {
      const hasImg = $(el).find('img').length > 0;
      const txt = $(el).text().trim();
      return hasImg && txt.length > 0;
    });

    cards.each((_, el) => {
      const name =
        $(el).find('h3, .title, .name, strong').first().text().trim() ||
        $(el).text().trim().split('\n')[0];
      const address = $(el)
        .find('.address, .location, address, .text-sm')
        .first()
        .text()
        .trim();
      const phone = $(el).find('a[href^="tel:"]').first().text().trim();
      const logo = $(el).find('img').first().attr('src');
      if (name)
        clinics.push({ name, address, phone, logo: this.absoluteUrl(logo) });
    });

    if (clinics.length === 0) {
      const sampleImgs = $('img')
        .slice(0, 10)
        .map((_, el) => $(el).attr('src'))
        .get()
        .map((u) => this.absoluteUrl(u));
      const sampleHeadings = $('h2, h3')
        .slice(0, 10)
        .map((_, el) => $(el).text().trim())
        .get();
      return {
        city: city || 'Tashkent',
        count: 0,
        clinics: [],
        debug: { sampleImgs, sampleHeadings },
      };
    }

    return { city: city || 'Tashkent', count: clinics.length, clinics };
  }

  async scrapeDoctors(specialty?: string) {
    const $ = await this.fetchFirstAvailableHtml([
      '/doctors',
      '/ru/doctors',
      '/',
      '/ru',
    ]);

    const doctors: any[] = [];
    $('[data-doctor], .doctor-card, .doctor-item, [class*="doctor"]').each(
      (_, el) => {
        const name = $(el).find('.title, .name, h3').first().text().trim();
        const spec = $(el).find('.specialty, .spec').first().text().trim();
        const clinic = $(el).find('.clinic, .place').first().text().trim();
        const photo = $(el).find('img').first().attr('src');
        if (name) {
          doctors.push({
            name,
            specialty: spec,
            clinic,
            photo: this.absoluteUrl(photo),
          });
        }
      },
    );

    return { specialty: specialty || null, count: doctors.length, doctors };
  }

  async scrapePromotions() {
    const $ = await this.fetchFirstAvailableHtml(['/', '/ru']);

    const promos: any[] = [];
    const promoHeading = $('h2, h3')
      .filter((_, el) => $(el).text().toLowerCase().includes('акции'))
      .first();
    const promoSection = promoHeading.closest('section, div');
    const promoCards = promoSection
      .find('a, div')
      .filter((_, el) => $(el).find('img').length > 0);

    promoCards.each((_, el) => {
      const title = $(el).find('h3, .title, strong').first().text().trim();
      const discount = $(el)
        .find('.discount, .badge, [class*="-%"], [class*="скид"]')
        .first()
        .text()
        .trim();
      const desc = $(el).find('.description, .desc, p').first().text().trim();
      const image = $(el).find('img').first().attr('src');
      if (title)
        promos.push({
          title,
          discount,
          description: desc,
          image: this.absoluteUrl(image),
        });
    });

    if (promos.length === 0) {
      const sampleBadges = $('[class*="%"], .badge, .discount')
        .slice(0, 10)
        .map((_, el) => $(el).text().trim())
        .get();
      return { count: 0, promotions: [], debug: { sampleBadges } };
    }

    return { count: promos.length, promotions: promos };
  }

  private getHeaders() {
    return {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'ru,en;q=0.9',
    } as Record<string, string>;
  }

  private absoluteUrl(url?: string) {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;
    if (url.startsWith('//')) return 'https:' + url;
    if (!url.startsWith('/')) return this.baseUrl + '/' + url;
    return this.baseUrl + url;
  }
}
