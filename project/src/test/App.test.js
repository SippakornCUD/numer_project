import { fireEvent, render, screen } from '@testing-library/react';
import Newton from '../root_method/Newton';

test('renders learn react link', () => {
  render(<Newton />);

  const fx = screen.getByTestId('fx');
  fireEvent.change(fx, {target : {value : "x^4-13"}});

  const x0 = screen.getByTestId('x0');
  fireEvent.change(x0, { target : {value : 1}});

  const btn = screen.getByTestId('button');
  fireEvent.click(btn);

  const ans = screen.getByTestId('answer').textContent;

  expect(ans).toBe("Answer : 1.898828922115942")
});