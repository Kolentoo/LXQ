<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <h1>{{title}}</h1>
    <h2 v-text='title'></h2>
    <p v-html='content'></p>
    <ul>
      <li v-for='item in items' v-bind:class='{finished:item.isFinished}' @click='toggleClick(item)'>
        {{item.label}}
      </li>
    </ul>
    <input v-model='newItem' v-on:keyup.enter='addNewItem'>
  </div>
</template>

<script>
// import Hello from './components/Hello'

export default {
  data() {
    return{
      title:'todo list',
      content:'todo content<span>!</span>',
      items:[
        {
          label:'coding',
          isFinished:false
        },
        {
          label:'walking',
          isfinished:true
        }
      ],
      // liClass:'lxq'
      newItem:''
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
