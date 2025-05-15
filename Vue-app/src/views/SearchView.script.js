export default {
  data() {
    return {
      query: '',
      results: [],
      filters: {
        type: '',
        location: '',
        level: '',
      },
    };
  },
  methods: {
    async fetchUniversities() {
      const params = new URLSearchParams({
        q: this.query,
        type: this.filters.type,
        location: this.filters.location,
        level: this.filters.level,
      });
      console.log(`Sending query to backend: ${params.toString()}`); // 调试信息

      try {
        const response = await fetch(`http://localhost:3000/api/universities?${params}`);
        const data = await response.json();
        console.log(`Received response from backend:`, data); // 调试信息
        this.results = data;
      } catch (error) {
        console.error(`Error fetching data from backend:`, error); // 调试信息
      }
    },
    async searchUniversities() {
      const params = new URLSearchParams({
        q: this.query,
        type: this.filters.type,
        location: this.filters.location,
        level: this.filters.level,
      });
      console.log(`Sending query to backend: ${params.toString()}`); // 调试信息

      try {
        const response = await fetch(`http://localhost:3000/api/universities?${params}`);
        const data = await response.json();
        console.log(`Received response from backend:`, data); // 调试信息
        this.results = data;
      } catch (error) {
        console.error(`Error fetching data from backend:`, error); // 调试信息
      }
    },
  },
  mounted() {
    // 页面加载时获取前10个院校信息
    this.searchUniversities();
  },
};
