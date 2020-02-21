class Comment {
    constructor(characterCount) {
      this.weight = 0;
      this.characterCount = characterCount;
      this.date = new Date().toLocaleDateString();
      
      if(this.characterCount >= 200){
          this.weight = Math.floor((characterCount / 200));
      }
      if(this.characterCount < 20){
          this.weight = this.weight - 1;
      }

      this.upvotes = 0;
    }
    getWeight(){
        return this.weight;
    }
    getcharacterCount(){
        return this.characterCount;
    }
    getUpvotes(){
        return this.upvotes;
    }
    setWeight(val){
        this.weight = val;
    }
    incrementWeight(){
        this.weight = this.weight + 1;
    }
    upvote(){
        this.upvotes = this.upvotes + 1;
        this.incrementWeight();
    }
    getDate(){
        return this.date;
    }
}

module.exports = Comment;