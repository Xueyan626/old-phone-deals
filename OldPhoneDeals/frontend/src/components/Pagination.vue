<template>
  <div class="pagination">
    <button :disabled="page<=1"   @click="$emit('update:page', page-1)">Prev</button>
    <span>Page {{ page }} / {{ totalPages }}</span>
    <button :disabled="page>=totalPages" @click="$emit('update:page', page+1)">Next</button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    total:   { type: Number, required: true },
    perPage: { type: Number, default: 10 },
    page:    { type: Number, default: 1 }
  },
  computed: {
    totalPages() { return Math.ceil(this.total / this.perPage); }
  }
};
</script>

<style scoped>
.pagination { display:flex; align-items:center; gap:10px; font-family:sans-serif; }
button { padding:4px 8px; border:1px solid #ccc; background:#fff; cursor:pointer; }
button:disabled { color:#999; cursor:not-allowed; }
</style>
