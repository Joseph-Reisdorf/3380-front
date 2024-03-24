import React from 'react';
import { useQuery } from "@tanstack/react-query";
import makeRequest from "axios";
import { useParams } from "react-router-dom";

const Album = () => {
  const { id } = useParams(); 
  const albumId = parseInt(id);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["album"], 
    queryFn: () => makeRequest.get(`http://localhost:8080/back_end/Album/find/${albumId}`).then((res) => res.data)
  });

  console.log(data);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching data</div>;

  return (
    <div>
      <h2>Album Details</h2>
      <div>
        <strong>Title:</strong> {data.album_title}
      </div>
      <div>
        <strong>Description:</strong> {data.album_description}
      </div>
      <div>
        <strong>Songs:</strong>
      </div>
    </div>
  )

};

export default Album;
