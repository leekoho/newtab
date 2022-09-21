export class GetTopPlaylistsDto {
  public cat: string
  public order?: string
  public limit: number
  public offset: number
  public total?: boolean
}
