import axios from "axios";

export const prodamusHref = async (id: number, discount?: number) => {
  const { data } = await axios.get(
    `https://wbclub05.payform.ru/?order_id=${id}&products[0][price]=50&products[0][quantity]=1&products[0][name]=Курс WB Эльвира и Альбина&customer_extra=Полная оплата курса по WB от Альбины и Эльвиры&do=link`
  );
  return data
};