<template>
 <div class="aa">
   <button  @click="homeBanner">点击</button>
 </div>
</template>

<script>
 export default {
   data () {
     return {
       type:0
     }
   },
   components: {

   },
   methods: {
    homeBanner(){
     this.$api.banner({type:2})
       .then(res=>{
         console.log(res);
       }).catch(err=>{
         console.log(err);
       })
     }
   },
   mounted() {

   },
   watch: {

   },
   computed: {

   }
 }
</script>

<style scoped lang='scss'>
.aa{
  text-align: center;
}
</style>