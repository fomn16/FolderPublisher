type Chat = {
  id: number;
  name: string;
}

type Message = {
  id: number;
  content: string;
  chatId: number;
  issuer: number;
}