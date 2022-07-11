const f = async (endpoint, query, { limit, offset = 0, action = 'getArtistAlbums' }) => {
  let filteredQuery = query;
  if (query instanceof Array) {
    limit = 20;
    filteredQuery = query.slice(offset, limit);
  }
  const data = await endpoint(action, filteredQuery, { limit, offset });
  let offsetCounter = offset;
  const returnData = [data];
  const total = data.body.total || query.length;
  while (total + limit > limit + offsetCounter) {
    let internalOffset = limit + offsetCounter;
    if (query instanceof Array){
      filteredQuery = query.slice(offsetCounter, offsetCounter + limit);
      internalOffset = 0;
    }
    returnData.push(await endpoint(action, filteredQuery, { limit, offset: internalOffset }));
    offsetCounter += limit;
  }
  return returnData;
};

export default f;
