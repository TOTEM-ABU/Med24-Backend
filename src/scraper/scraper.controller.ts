import { Controller, Get, Query } from '@nestjs/common';
import { ScraperService } from './scraper.service';

@Controller('scrape')
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @Get('clinics')
  async scrapeClinics(@Query('city') city?: string) {
    return this.scraperService.scrapeClinics(city);
  }

  @Get('doctors')
  async scrapeDoctors(@Query('specialty') specialty?: string) {
    return this.scraperService.scrapeDoctors(specialty);
  }

  @Get('promotions')
  async scrapePromotions() {
    return this.scraperService.scrapePromotions();
  }
}
