const app = new Vue({
    el: '#app',
    data: {
        url: '',
        slug: '',
        created: null,
        errorSlug: '',
        errorUrl: '',
        fullUrl: ''
    },
    methods:{
        async createUrl(){
            const response = await fetch('/url',{
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    url: this.url,
                    slug: this.slug
                }),
            });
            this.created = await response.json();
            if (this.created.message){
                if(this.created.message.toLowerCase().includes('slug')){
                    this.errorSlug = this.created.message;
                    this.errorUrl = "";
                }else{
                    this.errorUrl = this.created.message;
                    this.errorSlug = "";
                }
            }else{
                this.fullUrl = `${location.origin}/${this.slug} `
            }

        },
        async copyUrl() {
            await navigator.clipboard.writeText(this.fullUrl);
            // alert('Copied!');
            // POPUP
        },

        goBack(){
            this.url =  '';
            this.created =  null;
            this.errorSlug =  '';
            this.errorUrl =  '';
            this.fullUrl =  '';
            this.slug =  '';
        }
    }

})  