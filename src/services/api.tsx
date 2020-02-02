import data from './data.json';

let listData: number[] = data;

const fetchList = () => {
  return new Promise<number[]>(resolve => {
    setTimeout(() => {
      resolve(data);
    }, 3000);
  });
};

const addItem = (item: number) => {
  listData = [...data, item];
  return Promise.resolve<number>(item);
};

export { fetchList, addItem };
