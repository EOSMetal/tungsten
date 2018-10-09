<template>
  <div class="content">
    <section class="call-to-action-section">
      <div class="w-container">
        <div class="w-row">
          <div class="column w-col w-col-8">
            <h1 class="brand-text page-title">View your Claim</h1>
            <h2 class="page-subtitle">Manage your claim below</h2>
          </div>
          <div class="align-right w-col w-col-4"><a href="#" class="navy-button white">File New Claim</a></div>
        </div>
      </div>
    </section>
    <section id="Dashboard" class="section">
      <div class="w-container">
        <div class="w-row">
          <div class="w-col w-col-8">
            <h2 class="bond-name">Claim Name Here</h2>
            <div class="bond-form-block">
              <div class="bond-breakdown w-row">
                <div class="column-15 w-col w-col-3 w-col-small-3 w-col-tiny-6">
                  <h2 class="bond-info">On Bond</h2>
                </div>
                <div class="column-14 w-col w-col-9 w-col-small-9 w-col-tiny-6">
                  <h2 class="bond-answer"><strong>{bond name}</strong></h2>
                </div>
              </div>
              <div class="bond-breakdown w-row">
                <div class="column-15 w-col w-col-3 w-col-tiny-6 w-col-small-3">
                  <h2 class="bond-info">Created By</h2>
                </div>
                <div class="column-14 w-col w-col-9 w-col-tiny-6 w-col-small-9">
                  <h2 class="bond-answer"><strong> {claim creator}</strong></h2>
                </div>
              </div>
              <h2 class="bond-remaining">Claimed Amount</h2>
              <h2 class="bond-price">200 EOS</h2>
              <div class="bond-breakdown w-row">
                <div class="column-15 w-col w-col-3 w-col-tiny-6 w-col-small-3">
                  <h2 class="bond-info"><strong>Claim Details:</strong></h2>
                </div>
                <div class="column-14 w-col w-col-9 w-col-tiny-6 w-col-small-9">
                  <h2 class="bond-answer"><strong>(Language: {claim language})</strong></h2>
                </div>
              </div>
              <h2 class="contract-answer">Lorem ipsum dolor sit amet et delectus accommodare his consul copiosae
                legendos at vix ad putent delectus delicata usu. Vidit dissentiet eos cu eum an brute copiosae
                hendrerit. Eos erant dolorum an. Per facer affert ut. Mei iisque mentitum moderatius cu. Sit munere
                facilis accus.</h2>
            </div>
          </div>
          <div class="w-col w-col-4">
            <h1 class="brand-text claim-name">Actions</h1>
            <div class="active-claims-block">
              <h2 class="active-bond"><strong>Close Claim</strong></h2>
              <h2 class="active-bond"><strong>Rule Claim</strong></h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
