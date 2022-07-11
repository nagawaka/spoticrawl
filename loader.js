const f = async (endpoint, query, { limit, offset = 0, action = 'getArtistAlbums' }) => {
  let filteredQuery = query;
  const isArray = query instanceof Array;
  if (isArray) {
    // limit = 20;
    filteredQuery = query.slice(offset, limit);
  }
  const data = isArray ? await endpoint(action, filteredQuery) : await endpoint(action, filteredQuery, { limit, offset });
  console.log(action, filteredQuery, limit, offset);
  let offsetCounter = offset;
  const returnData = [data];
  console.log(data);
  const total = data.body.total || query.length;
  console.log(total + limit, limit + offsetCounter);
  while (total + limit > limit + offsetCounter) {
    let internalOffset = limit + offsetCounter;
    if (query instanceof Array){
      filteredQuery = query.slice(offsetCounter, offsetCounter + limit);
      internalOffset = 0;
    }
    returnData.push(isArray ? await endpoint(action, filteredQuery) : await endpoint(action, filteredQuery, { limit, offset: internalOffset }));
    offsetCounter += limit;
  }
  return returnData;
};

export default f;
