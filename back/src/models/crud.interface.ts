export interface CRUD<CreateRequest, UpdateRequest> {
  create(request: CreateRequest);
  update(request: UpdateRequest);
  read(id: number);
  delete(id: number);
}
