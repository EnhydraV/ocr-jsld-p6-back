import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { WorkshopsService } from './workshops.service';
import { Workshop, WorkshopDocument } from './schemas/workshop.schema';

const mockWorkshop = {
  _id: '507f1f77bcf86cd799439011',
  id: '507f1f77bcf86cd799439011',
  name: 'Docker Workshop',
  notions: [{ id: '507f1f77bcf86cd799439012', name: 'Containers' }],
  createdAt: new Date(),
  updatedAt: new Date(),
  populate: jest.fn(),
};

describe('WorkshopsService', () => {
  let service: WorkshopsService;
  let model: Model<WorkshopDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkshopsService,
        {
          provide: getModelToken(Workshop.name),
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

    service = module.get<WorkshopsService>(WorkshopsService);
    model = module.get<Model<WorkshopDocument>>(getModelToken(Workshop.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and populate a workshop', async () => {
      const populated = { ...mockWorkshop };
      mockWorkshop.populate.mockResolvedValue(populated);
      jest.spyOn(model, 'create').mockResolvedValue(mockWorkshop as any);

      const result = await service.create({
        name: 'Docker Workshop',
        notions: ['507f1f77bcf86cd799439012'],
      });

      expect(result).toEqual(populated);
      expect(model.create).toHaveBeenCalled();
      expect(mockWorkshop.populate).toHaveBeenCalledWith('notions');
    });
  });

  describe('findAll', () => {
    it('should return all workshops populated', async () => {
      const mockWorkshops = [mockWorkshop];
      jest.spyOn(model, 'find').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockWorkshops),
        }),
      } as any);

      const result = await service.findAll();

      expect(result).toEqual(mockWorkshops);
    });
  });

  describe('findOne', () => {
    it('should return a workshop by id', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockWorkshop),
        }),
      } as any);

      const result = await service.findOne('507f1f77bcf86cd799439011');

      expect(result).toEqual(mockWorkshop);
    });

    it('should throw NotFoundException if workshop not found', async () => {
      jest.spyOn(model, 'findById').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      } as any);

      await expect(
        service.findOne('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a workshop', async () => {
      const updated = { ...mockWorkshop, name: 'CI/CD Workshop' };
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(updated),
        }),
      } as any);

      const result = await service.update('507f1f77bcf86cd799439011', {
        name: 'CI/CD Workshop',
      });

      expect(result.name).toBe('CI/CD Workshop');
    });

    it('should throw NotFoundException if workshop not found', async () => {
      jest.spyOn(model, 'findByIdAndUpdate').mockReturnValue({
        populate: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      } as any);

      await expect(
        service.update('507f1f77bcf86cd799439011', { name: 'test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a workshop', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockWorkshop),
      } as any);

      await expect(
        service.remove('507f1f77bcf86cd799439011'),
      ).resolves.toBeUndefined();
    });

    it('should throw NotFoundException if workshop not found', async () => {
      jest.spyOn(model, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(
        service.remove('507f1f77bcf86cd799439011'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
