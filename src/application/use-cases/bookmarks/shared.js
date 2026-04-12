const tagRepository = require('../../../infrastructure/database/repositories/TagRepository');
const { ValidationError } = require('../../../shared/errors');

const ALLOWED_TYPES = ['link', 'note', 'prompt'];

function normalizeString(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function buildFaviconUrl(url) {
  if (!url) return null;

  try {
    const urlObject = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObject.hostname}&sz=64`;
  } catch {
    return null;
  }
}

async function resolveTagIds(tagIds, userId) {
  if (!Array.isArray(tagIds) || tagIds.length === 0) {
    return [];
  }

  const tags = await Promise.all(
    tagIds.map(id => tagRepository.findByIdAndUser(id, userId))
  );

  return tags.filter(Boolean).map(tag => tag._id);
}

async function buildBookmarkPayload(input, userId, { partial = false } = {}) {
  const payload = {};
  const type = normalizeString(input.type) || 'link';

  if (!ALLOWED_TYPES.includes(type)) {
    throw new ValidationError('Type must be link, note, or prompt');
  }

  const title = normalizeString(input.title);
  const url = normalizeString(input.url);
  const description = normalizeString(input.description);
  const content = normalizeString(input.content);
  const category = normalizeString(input.category);

  if (!partial || Object.prototype.hasOwnProperty.call(input, 'type')) {
    payload.type = type;
  }

  if (!partial || Object.prototype.hasOwnProperty.call(input, 'title')) {
    if (!title) {
      throw new ValidationError('Title is required');
    }
    payload.title = title;
  }

  if (type === 'link') {
    if ((!partial || Object.prototype.hasOwnProperty.call(input, 'url')) && !url) {
      throw new ValidationError('URL is required for links');
    }

    if (url) {
      try {
        // eslint-disable-next-line no-new
        new URL(url);
      } catch {
        throw new ValidationError('Valid URL is required for links');
      }
    }
  } else if ((!partial || Object.prototype.hasOwnProperty.call(input, 'content')) && !content) {
    throw new ValidationError(type === 'note' ? 'Content is required for notes' : 'Content is required for prompts');
  }

  if (!partial || Object.prototype.hasOwnProperty.call(input, 'url')) {
    payload.url = type === 'link' ? url : null;
  }
  if (!partial || Object.prototype.hasOwnProperty.call(input, 'description')) {
    payload.description = description;
  }
  if (!partial || Object.prototype.hasOwnProperty.call(input, 'content')) {
    payload.content = type === 'link' ? null : content;
  }
  if (!partial || Object.prototype.hasOwnProperty.call(input, 'category')) {
    payload.category = category;
  }
  if (!partial || Object.prototype.hasOwnProperty.call(input, 'tag_ids')) {
    payload.tags = await resolveTagIds(input.tag_ids, userId);
  }

  payload.favicon_url = type === 'link' ? buildFaviconUrl(url) : null;

  return payload;
}

module.exports = {
  ALLOWED_TYPES,
  buildBookmarkPayload,
};
