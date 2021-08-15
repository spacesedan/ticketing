import { Ticket } from '../tickets';

it('implements optimistic concurrency control', async () => {
  // Create an instance of a ticker
  const ticket = Ticket.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  // Save the ticket to the database
  await ticket.save();

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // makae two seperate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  //  save the first fetched ticket
  await firstInstance?.save();

  // save the second fetched ticket and expect an error
  try {
    await secondInstance?.save();
  } catch (err) {
    return;
  }

  throw new Error('Should nnot reach this point');
});

it('increments the version number on multiple save', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20,
    userId: '123',
  });

  await ticket.save();

  expect(ticket.version).toEqual(0);

  await ticket.save();

  expect(ticket.version).toEqual(1);

  await ticket.save();

  expect(ticket.version).toEqual(2);
});