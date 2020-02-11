import data from './data.json';

let listData: number[] = Array.from(data);

const fetchList = () => {
  return new Promise<number[]>(resolve => {
    setTimeout(() => {
      resolve(listData);
    }, 200);
  });
};

const addItem = (item: number) => {
  listData = [...listData, item];
  return new Promise<number>(resolve => {
    setTimeout(() => {
      resolve(item);
    }, 100);
  });
};

const deleteItem = (itemToRemove: number) => {
  listData = listData.filter(item => item !== itemToRemove);
  return new Promise<number>(resolve => {
    setTimeout(() => {
      resolve(itemToRemove);
    }, 100);
  });
};

export default { fetchList, addItem, deleteItem };
