import http from "../http-common";

const getAll = () => {
  return http.get("/locations");
};

const get = id => {
  return http.get(`/locations/${id}`);
};

const findByTitle = title => {
  return http.get(`/locations?title=${title}`);
};

const findMarkedImportant = () => {
  return http.get(`/locations/markedImportant`);
}

const findAllTitle = () => {
  return http.get(`/locations/title`);
}

export default {
  getAll,
  get,
  findByTitle,
  findMarkedImportant,
  findAllTitle
};
