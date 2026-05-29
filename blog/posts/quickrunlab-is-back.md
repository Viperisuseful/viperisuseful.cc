[QuickRunLab](https://www.quickrunlab.tech/) is back. If you tried to open it a while ago and got nothing, that was on me, and here's the honest version of what happened.

## It came down to money

QuickRunLab runs your code on a real server. C, Python, and R, in a live terminal in your browser. That's the whole point of it, and it's also the whole problem, because a server that runs other people's code all day costs real money to keep on.

For a while I paid for it out of pocket. Then the bill stopped making sense for a side project nobody was paying me for, so I made the call I'd been putting off and shut it down. It felt bad. People were actually using the thing.

## Then I found the Oracle free tier

I'd written QuickRunLab off as "nice while it lasted." Then one night I went down a rabbit hole and landed on Oracle's always-free tier. Not a 30-day trial, and not some tiny box that tips over the second two people show up. A real ARM server that stays free, with enough cores and memory to run actual workloads.

That changed the math completely. The thing that killed QuickRunLab was the monthly bill, and now the bill is zero.

So I rebuilt it on Oracle, and it's live again at [quickrunlab.tech](https://www.quickrunlab.tech/).

## What you get now

More compute than the old box ever had. In practice that means longer runs and a lot less waiting when a few people are hammering it at once. If you're learning a language or just want to test a quick script, it should work without any setup.

You can also have a real account now. Sign up with an email, or link straight through Google or GitHub if you'd rather not make another password. Your work follows you around instead of vanishing the moment you close the tab.

## One honest warning: rootz is a mess

The file manager, rootz, is in shambles right now. I'm not going to pretend otherwise. It half works, it does things I never asked it to, and I'm in the middle of tearing it apart to rebuild it properly. If you poke at it and it acts strange, you're not imagining things. It really is like that.

Everything else is solid. The file manager just needs a few more late nights.

So go run something at [quickrunlab.tech](https://www.quickrunlab.tech/). And if rootz eats your file, well, now you know why.
