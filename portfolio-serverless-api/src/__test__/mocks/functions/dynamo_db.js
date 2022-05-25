const mockGetDynamo = (constructor, isRejected = false, data) => {
  return jest.spyOn(constructor.prototype, "get").mockImplementation(() => {
    if (isRejected) {
      return {
        promise: jest.fn().mockImplementation(() => {
          return Promise.reject(data);
        }),
      };
    }
    return {
      promise: jest.fn().mockImplementation(() => {
        return Promise.resolve(data);
      }),
    };
  });
};

const mockUpdateDynamo = (constructor, isRejected = false, data) => {
  return jest.spyOn(constructor.prototype, "update").mockImplementation(() => {
    if (isRejected) {
      return {
        promise: jest.fn().mockImplementation(() => {
          return Promise.reject(data);
        }),
      };
    }
    return {
      promise: jest.fn().mockImplementation(() => {
        return Promise.resolve(data);
      }),
    };
  });
};

module.exports = { mockGetDynamo, mockUpdateDynamo };
