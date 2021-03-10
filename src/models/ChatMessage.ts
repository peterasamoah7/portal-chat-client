export class ChatMessage{
    text: string;
    user: string;
    lang: string;

    constructor(text: string, user: string, lang: string){
        this.user = user; 
        this.lang = lang;
        this.text = text; 
    }
}