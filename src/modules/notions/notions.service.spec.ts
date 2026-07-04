import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { NotionsService } from './notions.service';
import { Notion, NotionDocument } from './schemas/notion.schema';

const mockNotion = {
  _id: '507f1f77bcf86cd799439011',
  id: '507f1f77bcf86cd799439011',
  name: 'JavaScript',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('NotionsService', () => {
  let service: NotionsService;
  let model: Model<NotionDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotionsService,
        {
          provide: getModelToken(Notion.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotionsService>(NotionsService);
    model = module.get<Model<NotionDocument>>(getModelToken(Notion.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a notion', async () => {
      jest.spyOn(model, 'create').mockResolvedValue(mockNotion as any);

      const result = await service.create({ name: 'JavaScript' });

      expect(result).toEqual(mockNotion);
      expect(model.create).toHaveBeenCalledWith({ name: 'JavaScript' });
    });
  });

  describe('findAll', () => {
    it('should return all notions', async () => {
      const mockNotions = [mockNotion];
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockNotions),
      } as any);

      const result = await service.findAll();

      expect(result).toEqual(mockNotions);
      expect(model.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a notion by id', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockNotion),
      } as any);

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockNotion);
    });

    it('should throw NotFoundException if notion not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a notion', async () => {
      const updated = { ...mockNotion, name: 'TypeScript' };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updated),
      } as any);

      const result = await service.update('507f1f77bcf86cd799439011', {
        name: 'TypeScript',
      });

      expect(result.name).toBe('TypeScript');
    });

    it('should throw NotFoundException if notion not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        service.update('507f1f77bcf86cd799439011', { name: 'TypeScript' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a notion', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockNotion),
      } as any);

      await expect(
        service.remove('507f1f77bcf86cd799439011'),
      ).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if notion not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        service.remove('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
