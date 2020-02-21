var assert = require('assert');
const Comment = require('../src/Comment.js')

describe ('Comment', function(){

  describe ('#constructor()', function(){
    //Create a comment
    it('should create create a comment object with a weight value of 0', function(){
      comment = new Comment(30);
      assert.equal(comment.getWeight(), 0);
    });

    //Weight increase of 1 point per 200 characters
    it('should increment weight by 1 per 200 characters', function(){
      comment = new Comment(200);
      assert.equal(comment.getWeight(), 1);
      comment = new Comment(250);
      assert.equal(comment.getWeight(), 1);
      comment = new Comment(300);
      assert.equal(comment.getWeight(), 1);
      comment = new Comment(400);
      assert.equal(comment.getWeight(), 2);
      comment = new Comment(500);
      assert.equal(comment.getWeight(), 2);
      comment = new Comment(700);
      assert.equal(comment.getWeight(), 3);
    });

    //Weight decrease of 1 point if < 20 characters
    it('should decrease weight by 1 for comments with less than 20 characters', function(){
      comment = new Comment(18);
      assert.equal(comment.getWeight(), -1);
    });
  });

  //Assign a comment a weight
  describe('#assignWeight()', function(){
    it('should have a weight assigned to it that is passed by the user', function(){
      comment = new Comment(30);
      comment.setWeight(4);
      assert.equal(comment.getWeight(), 4);
    });
  });

  //Upvote a comment + weight increase of 1
  describe('#upvote()', function(){
    it('should have the weight increase by one when the comment is upvoted', function(){
      comment = new Comment(30);
      assert.equal(comment.getWeight(), 0);
      comment.upvote();
      assert.equal(comment.getWeight(), 1);
      assert.equal(comment.getUpvotes(), 1);
    });
  });

  //Weight increase of 1 point per month
  describe('#getDate', function(){
    it('should have todays date', function(){
      comment = new Comment(30);
      assert.equal(comment.getDate(), new Date().toLocaleDateString());
    });
  });

  
  

});


//weight increase of 1 point per 200 characters



