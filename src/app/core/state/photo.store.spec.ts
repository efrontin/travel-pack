import { TestBed } from '@angular/core/testing';
import { LocalRepository } from '../db/local-repository';
import { WriteQueue } from '../db/write-queue';
import { entryPhotoId, JournalStore } from './journal.store';
import { PhotoStore } from './photo.store';

describe('PhotoStore', () => {
  let photos: PhotoStore;
  const saved = async () => {
    await TestBed.inject(WriteQueue).idle();
    return (await new LocalRepository().load()).photos;
  };

  beforeEach(() => (photos = TestBed.inject(PhotoStore)));

  it('stores a file and shows it', async () => {
    photos.set('hero', new Blob([new Uint8Array([1, 2])], { type: 'image/jpeg' }));
    expect(photos.src('hero')).toMatch(/^blob:/);
    expect((await saved())[0].blob?.size).toBe(2);
  });

  it('stores a web address', async () => {
    photos.set('item-ordi', 'https://example.com/ordi.jpg');
    expect(photos.src('item-ordi')).toBe('https://example.com/ordi.jpg');
    expect((await saved())[0].url).toBe('https://example.com/ordi.jpg');
  });

  it('deletes the photo along with its journal entry', async () => {
    photos.set(entryPhotoId('e1'), 'https://example.com/tokyo.jpg');
    TestBed.inject(JournalStore).remove('e1');
    expect(photos.src(entryPhotoId('e1'))).toBe('');
    expect(await saved()).toEqual([]);
  });
});
