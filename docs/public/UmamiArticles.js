import { LitElement, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { JsonApiClient } from "https://esm.run/@drupal-api-client/json-api-client";

class LitUmamiArticles extends LitElement {
  // Define articles property so that changes can be observed
  static properties = {
    articles: [],
  };

  // Retrieve data from Drupal in connectedCallback lifecycle method
  async connectedCallback() {
    super.connectedCallback()

    const client = new JsonApiClient(
      "https://dev-drupal-api-client-poc.pantheonsite.io",
    );
    this.articles = await client.getCollection("node--article");
  }

  render() {
    if (!this.articles) {
      return html`<h1>Umami Articles</h1><p>Loading...</p>`;
    }
    else {
      return html`<h1>Umami Articles</h1>
        <ul>
          ${this.articles.data.map((article) => html`<li>${article.attributes.title}</li>`)}
        </ul>`;
    }
  }
}

class UmamiArticles extends HTMLElement {
  async connectedCallback() {
    const template = `
      <h1>Umami Articles</h1>
      <ul>Loading...</ul>
    `
    const elem = document.createElement('template')
    elem.innerHTML = template

    // Render initial loading state
    this.attachShadow({ mode: 'open' }).appendChild(
      elem.content.cloneNode(true)
    )

    // Retrieve data from Drupal
    const client = new JsonApiClient(
      "https://dev-drupal-api-client-poc.pantheonsite.io",
    );
    const articles = await client.getCollection("node--article");

    // Remove loading indicator
    this.shadowRoot.querySelector("ul").innerHTML = "";
    // Render list of articles
    articles.data.forEach(element => {
      const listItem = document.createElement("li");
      listItem.innerHTML = element.attributes.title;
      this.shadowRoot.querySelector("ul").appendChild(listItem);
    });
  }
}


if (!customElements.get('umami-articles')) {
  customElements.define("umami-articles", UmamiArticles);
}

if (!customElements.get('lit-umami-articles')) {
  customElements.define("lit-umami-articles", LitUmamiArticles);
}