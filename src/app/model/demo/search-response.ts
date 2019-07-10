import { ApiResponse } from "./api-response";
import { Company } from "./company";

export class SearchResponse extends ApiResponse{
    public data: Company[];
}
