import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async create(dto: CreateContactDto) {
    const contact = this.contactRepository.create(dto);

    return this.contactRepository.save(contact);
  }

  async findAll() {
    return this.contactRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }
}