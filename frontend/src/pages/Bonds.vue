<template>
  <div class="row">
    <div class="col-md-6 col-xl-3" v-for="bond in bonds" :key="bond.name">
      <stats-card>
        <div class="numbers" slot="content">
          <p>{{bond.name}}</p>
          {{bond.deposit}}
        </div>
        <div class="stats" slot="footer">
          <i class="ti-user"></i> {{bond.creator}}
        </div>
      </stats-card>
    </div>
  </div>
</template>
<script>
import { StatsCard } from "@/components/index";
import eosjs from 'eosjs';

export default {
  components: { StatsCard },
  data: () => ({
    bonds: [
      {
        name: "somebond",
        deposit: "1000 EOS",
        creator: "andy"
      }
    ]
  }),
  async mounted() {
    this.eos = eosjs({
      chainId: "6cbecff836a9fa60da53bf97a0a180103b2e76041d4414693d11bf39e2341547",
      url: "http://127.0.0.1:8888"
    });
    const data = await this.eos.getTableRows({
      json: true,
      code: "tungsten",
      scope: "tungsten",
      table: "bonds"
    });
    this.bonds = data.rows;
  }
};
</script>
