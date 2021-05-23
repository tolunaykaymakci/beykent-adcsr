export class DataTransmissionRequest {
  d; //data -> byte[]
  tid; //taskId -> string
  s; //step -> int
  di; //dataIndex -> int
  ds; //dataSizes -> int[]
}

export class PostComposationRequest extends DataTransmissionRequest {
  lid; // lessonId -> int
  sid; // subjectId -> int
  p_body; // postBody -> string
  reply_to = -1; // replyToPost -> long (-1 means it is a root post)
  mark_a; // markAsAnswer -> bool
}
