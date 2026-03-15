/**
 * Получает отображаемое имя клиента из объекта.
 * API может возвращать name, full_name или fio.
 */
export function getClientName(client) {
  if (!client) return "";
  return client.name || client.full_name || client.fio || "";
}
