import { apiClient, HttpError } from './apiClient';

// Mock fetch globally
global.fetch = jest.fn();

describe('ApiClient', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('GET request', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiClient.get('/test');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should handle query parameters', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await apiClient.get('/test', { params: { query: 'search', limit: '10' } });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('query=search&limit=10'),
        expect.any(Object)
      );
    });
  });

  describe('POST request', () => {
    it('should make successful POST request with body', async () => {
      const mockData = { id: 1 };
      const postBody = { name: 'New Item' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const result = await apiClient.post('/test', postBody);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(postBody),
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('Error handling', () => {
    it('should throw HttpError on 404', async () => {
      const errorData = {
        title: 'Not Found',
        status: 404,
        detail: 'Resource not found',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => errorData,
      });

      const error = await apiClient.get('/test').catch((e: HttpError) => e);

      expect(error).toBeInstanceOf(HttpError);
      expect(error.status).toBe(404);
      expect(error.data).toEqual(errorData);
    });

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network failure'));

      await expect(apiClient.get('/test')).rejects.toThrow(HttpError);
      await expect(apiClient.get('/test')).rejects.toMatchObject({
        status: 0,
        statusText: 'Network Error',
      });
    });
  });
});
