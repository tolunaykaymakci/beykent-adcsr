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
  reply_to; // replyToPost -> long
  mark_a; // markAsAnswer -> bool
}
