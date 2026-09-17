import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      name: 'Gracia Education Hub API',
      message: 'Knowledge with purpose. Impact with action.',
      status: 'running',
    };
  }
}