import { Either, left, right } from './either';

describe('Either class of Functional Error Handling tests', () => {
  
  function doSomething(shouldSuccess: boolean): Either<string, string> {
    if (shouldSuccess) {
      return right('success');
    } else {
      return left('error');
    }
  }

  it('should return success result', () => {
    const result = doSomething(true);
  
    expect(result.isRight()).toBe(true);
    expect(result.isLeft()).toBe(false);
  });
  
  it('should return error result', () => {
    const result = doSomething(false);
  
    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
  });
});
