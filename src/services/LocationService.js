import http from "../http-common";

const getAll = () => {
  return http.get("/locations");
};

const get = id => {
  return http.get(`/locations/${id}`);
};

const getTag = id => {
  return http.get(`/locations/tags/${id}`);
};

const getAllTags = () => {
  return http.get(`/locations/tags/`);
}

const findByTitle = title => {
  return http.get(`/locations?title=${title}`);
};

const findMarkedImportant = () => {
  return http.get(`/locations/markedImportant`);
}

const findAllTitle = () => {
  return http.get(`/locations/title`);
}

const getAllAdvanced = (params) => {
  return http.get("/locations/pages", {params});
};

export default {
  getAll,
  getAllTags,
  get,
  getTag,
  findByTitle,
  findMarkedImportant,
  findAllTitle,
  getAllAdvanced
};
