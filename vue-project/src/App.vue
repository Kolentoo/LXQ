<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <h1>{{title}}</h1>
    <h2 v-text='title'></h2>
    <!--<p v-html='content'></p>-->
    <test study='lets start vuejs study' v-on:listen='lesson'></test>
    <p>输出内容：{{ words }}</p>
    <ul>
      <li v-bind:class='{finished:item.isFinished}' @click='toggleClick(item)' v-for='item in items'>
        {{item.label}}
      </li>
    </ul>
    <input v-model='newItem' v-on:keyup.enter='addNewItem'>
  </div>
</template>

<script>
// import Hello from './components/Hello'
import Store from './components/store.js';
import test from './components/test.vue';
// console.log(Store);

export default {
  data:function() {
    return{
      title:'todo list',
      // content:'todo content<span>!</span>',
      items:Store.fetch(),
      // liClass:'lxq'
      newItem:'',
      words:''
    }
  },
  props:['study'],
  components:{ test },
  watch:{
    items:{
      handler: function(items) {
        Store.save(items);
      },
      deep: true
    }
  },
  methods:{
    toggleClick:function (item){
      console.log(item);
      item.isFinished = !item.isFinished;
    },
    addNewItem:function(){
      this.items.push({
        label:this.newItem,
        isFinished:false
      });
      this.newItem='';
    },
    lesson:function(msg){
      this.words = msg;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.finished {text-decoration: underline;color:blue;}
</style>
