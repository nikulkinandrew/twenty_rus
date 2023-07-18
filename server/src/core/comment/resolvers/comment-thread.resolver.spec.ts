import { Test, TestingModule } from '@nestjs/testing';
import { CommentThreadResolver } from './comment-thread.resolver';
import { CommentThreadService } from '../services/comment-thread.service';
import { CanActivate } from '@nestjs/common';
import { CreateOneCommentGuard } from 'src/guards/create-one-comment.guard';
import { CreateOneCommentThreadGuard } from 'src/guards/create-one-comment-thread.guard';
import { AbilityFactory } from 'src/ability/ability.factory';
import { FileUploadService } from 'src/core/file/services/file-upload.service';
import { AttachmentService } from 'src/core/file/services/attachment.service';

describe('CommentThreadResolver', () => {
  let resolver: CommentThreadResolver;

  beforeEach(async () => {
    const mockGuard: CanActivate = { canActivate: jest.fn(() => true) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentThreadResolver,
        {
          provide: CommentThreadService,
          useValue: {},
        },
        {
          provide: AbilityFactory,
          useValue: {},
        },
        {
          provide: FileUploadService,
          useValue: {},
        },
        {
          provide: AttachmentService,
          useValue: {},
        },
      ],
    })
      .overrideGuard(CreateOneCommentGuard)
      .useValue(mockGuard)
      .overrideGuard(CreateOneCommentThreadGuard)
      .useValue(mockGuard)
      .compile();

    resolver = module.get<CommentThreadResolver>(CommentThreadResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
