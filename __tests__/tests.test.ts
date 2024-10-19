import { app } from '../src/app/App'; 

test('app function should be called', () => {
  const appMock = jest.fn(app); 

  appMock();

  expect(appMock).toHaveBeenCalled();

  expect(appMock).toHaveBeenCalledTimes(1);
});
