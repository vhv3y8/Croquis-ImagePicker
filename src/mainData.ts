interface tag {
  tag: string;
}

interface tagList {
  [tagNum: number]: tag;
}

interface file {
  filename: string;
  tags: number[];
}

var selectedFiles: file[];
var selectedTags: tagList;

export { selectedFiles, selectedTags };
