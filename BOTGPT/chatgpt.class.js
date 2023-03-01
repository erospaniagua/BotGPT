const { CoreClass } = require("@bot-whatsapp/bot");

class ChatGPTClass extends CoreClass{
    queue =[];
    optionsGPT = { model: "text-davinci-003" };
    openai = undefined;
    
    constructor(_database , _provider , _optionsgpt ={}) {
        super(null, _database, _provider); 
        this.optionsGPT = {...this.optionsGPT , ..._optionsgpt};
        this.init().then();
            
    };

    init = async() => {
        const {ChatGPTAPI} = await import("chatgpt");
        this.openai = new ChatGPTAPI({
            apiKey: process.env.OPENAI_API_KEY,
        })
    };

    handleMsg = async (ctx) => {
        const { from, body } = ctx;

        const completion = await this.openai.sendMessage(body,{
            conversationId: !this.queue.length 
            ? undefined 
            :this.queue[this.queue.length - 1].conversationId,
            perentMessageId: !this.queue.length
            ? undefined 
            :this.queue[this.queue.length - 1].id,
        });

        this.queue.push(completion);

        const parseMesage = {
            ...completion,
            awnser: completion, text,
        };
        this.sendFlowSimple([parseMesage], from)
    };

}

module.exports = ChatGPTClass