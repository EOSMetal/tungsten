<template>
  <div class="content">
    <section class="call-to-action-section">
      <div class="w-container">
        <div class="w-row">
          <div class="column w-col w-col-8">
            <h1 class="brand-text page-title">Create a new Claim</h1>
            <h2 class="page-subtitle">Submit the form below</h2>
          </div>
          <div class="align-right w-col w-col-4"><img src="images/EOSMetalLogonew.png" width="129" srcset="images/EOSMetalLogonew-p-500.png 500w, images/EOSMetalLogonew-p-800.png 800w, images/EOSMetalLogonew-p-1080.png 1080w, images/EOSMetalLogonew.png 1280w"
              sizes="129px" alt=""></div>
        </div>
      </div>
    </section>
    <section id="Dashboard" class="section">
      <div class="container-4 w-container">
        <div class="w-row">
          <div class="w-col w-col-8">
            <div class="bond-form-block">
              <div class="w-row">
                <div class="w-col w-col-9">
                  <h2 class="bond-name title">Create Here</h2>
                  <h2 class="contract-answer bond-p">Lorem ipsum dolor sit amet et delectus accommodare his consul
                    copiosae legendos at vix ad putent delectus delicata usu. Vidit dissentiet eos cu eum an brute.</h2>
                </div>
                <div class="w-col w-col-3"></div>
              </div>
              <div class="w-form">
                <form id="email-form" name="email-form" data-name="Email Form" class="form w-clearfix">
                  <div class="w-clearfix"><label for="Bond-Name" class="bond-label-form">Bond Name</label><input type="text"
                      class="text-field w-input" maxlength="256" name="Deposit-Amount-3" data-name="Deposit Amount 3"
                      id="Deposit-Amount-3" required=""><label for="Deposit-Amount" class="bond-label-form">Claim Name</label></div><input
                    type="text" class="text-field w-input" maxlength="256" name="Deposit-Amount-2" data-name="Deposit Amount 2"
                    id="Deposit-Amount-2" required=""><label for="Deposit-Amount" class="bond-label-form">Claimed
                    Amount</label><input type="text" class="text-field w-input" maxlength="256" name="Bond-Name-2"
                    data-name="Bond Name 2" id="Bond-Name-2"><label for="Language" class="bond-label-form">Language</label><select
                    id="Language" name="Language" data-name="Language" class="text-field w-select">
                    <option value="">Select one...</option>
                    <option value="First">First Choice</option>
                    <option value="Second">Second Choice</option>
                    <option value="Third">Third Choice</option>
                  </select>
                  <div></div><label for="Bond-Name" class="bond-label-form">Claim Details</label><textarea id="field"
                    name="field" maxlength="5000" data-name="Field" class="textarea w-input"></textarea><input type="submit"
                    value="Submit Claim" data-wait="Please wait..." class="navy-button submit-light w-button">
                </form>
                <div class="w-form-done">
                  <div>Thank you! Your submission has been received!</div>
                </div>
                <div class="w-form-fail">
                  <div>Oops! Something went wrong while submitting the form.</div>
                </div>
              </div>
            </div>
          </div>
          <div class="w-col w-col-4">
            <h1 class="brand-text claim-name form-left">Helpful Links</h1>
            <div class="active-claims-block">
              <h2 class="active-bond"><strong>Claim</strong></h2>
              <h2 class="active-bond"><strong>Claim</strong></h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
