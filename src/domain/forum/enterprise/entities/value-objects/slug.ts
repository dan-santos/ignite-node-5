export class Slug {
  public content: string;

  private constructor(content: string){
    this.content = content;
  }

  static create(slug: string) {
    return new Slug(slug);
  }

  static createFromText(text: string){
    const slugText = text
      .normalize('NFKD')
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '');

    return new Slug(slugText);
  }
}