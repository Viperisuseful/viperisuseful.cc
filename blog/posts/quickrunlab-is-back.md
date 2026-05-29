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

## A heads-up about the file manager

QuickRunLab's file manager runs on rootz, a service that gave me free API access so I didn't have to pay to store anyone's files. For a project living on a free server, that was a real help.

The problem is rootz itself. Their dashboard has gotten buggy lately and the whole site feels off, and when the thing underneath you turns unreliable, everything sitting on top of it does too. So the file manager feels rough right now, and most of that isn't something I can fix from my end.

The rest of QuickRunLab is steady. File storage is the weak spot, so I'm moving it onto a different service. Until that's done, the file manager is the one part I wouldn't fully trust.

So go run something at [quickrunlab.tech](https://www.quickrunlab.tech/). Just don't hand the file manager anything you can't afford to lose until I've moved it somewhere steadier.
